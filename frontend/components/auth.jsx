"use client"

import { useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useCreateUser } from "../services/userQuery"

export function AuthLoginOrSign() {
    const { isSignedIn, isLoaded } = useUser()
    const { createUser } = useCreateUser()

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            createUser()
                .then((data) => {
                    console.log("User successfully synced to database:", data);
                })
                .catch((err) => {
                    console.error("Failed to sync user to database:", err);
                });
        }
    }, [isLoaded, isSignedIn, createUser]);

    return null;
}