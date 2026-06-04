import Order from "../modal/order.modal.js";
import User from "../modal/user.modal.js";

// Fetch aggregated dashboard metrics (Admin only)
export const getDashboardStats = async (req, res) => {
  try {
    // 1. Summary Statistics (Total Revenue, Order Count, Average Order Value)
    const summaryData = await Order.aggregate([
      { $match: { status: "paid" } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalPrice" },
          ordersCount: { $sum: 1 },
        },
      },
    ]);

    const totalSales = summaryData[0]?.totalSales || 0;
    const ordersCount = summaryData[0]?.ordersCount || 0;
    const aov = ordersCount > 0 ? totalSales / ordersCount : 0;

    // Distinct customer counts
    const distinctUsers = await Order.distinct("user", { status: "paid" });
    const activeCustomers = distinctUsers.length;

    // 2. Daily Revenue Trend (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyTrendRaw = await Order.aggregate([
      {
        $match: {
          status: "paid",
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalPrice" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Build full 7-day array to ensure dates with 0 sales are not missing
    const dailyRevenue = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const match = dailyTrendRaw.find((item) => item._id === dateStr);
      dailyRevenue.push({
        date: new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        revenue: match ? match.revenue : 0,
        orders: match ? match.count : 0,
      });
    }

    // 3. Best Selling Products (Top 5)
    const bestSelling = await Order.aggregate([
      { $match: { status: "paid" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          name: { $first: "$items.productName" },
          salesCount: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { salesCount: -1 } },
      { $limit: 5 },
    ]);

    // 4. Category Breakdown
    const categoryStats = await Order.aggregate([
      { $match: { status: "paid" } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$productDetails.productCategory",
          salesCount: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    return res.status(200).json({
      success: true,
      summary: {
        totalSales,
        ordersCount,
        aov,
        activeCustomers,
      },
      dailyRevenue,
      bestSelling,
      categoryStats,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
