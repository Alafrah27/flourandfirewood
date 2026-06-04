import Footer from "../../components/Footer";

export default function TabsLayout({ children }) {
    return (
        <div className="w-full flex flex-col min-h-screen">
            <div className="flex-grow">
                {children}
            </div>
            <Footer />
        </div>
    );
}