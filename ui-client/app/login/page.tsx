'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Link from 'next/link';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loginSuccess, setLoginSuccess] = useState(false);

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        setLoginSuccess(false);

        console.log("Attempting login:", { username });

        try {
            const authRes = await fetch('http://localhost:9000/login', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${btoa(`${username}:${password}`)}`
                },
            });

            if (!authRes.ok) {
                 if (authRes.status === 401) {
                    throw new Error("Invalid username or password.");
                 } else {
                    const errorText = await authRes.text();
                    throw new Error(`Authentication failed: ${authRes.statusText || authRes.status} - ${errorText}`);
                 }
            }
            const token = await authRes.text();
            console.log("Received Token:", token);
            setLoginSuccess(true);

        } catch (err: any) {
            setError(err.message || "An error occurred during login.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[calc(100vh-100px)]">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        {loginSuccess && <p className="text-green-600 text-sm">Login Successful!</p>}
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-3">
                        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </Button>
                         <p className="text-sm text-center text-gray-600">
                             Don't have an account?{' '}
                             <Link href="/register" className="text-red-600 hover:underline">
                                 Register here
                             </Link>
                         </p>
                    </CardFooter>
                </form>
            </Card>
        </main>
    );
}
