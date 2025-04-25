'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Link from 'next/link';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [registerSuccess, setRegisterSuccess] = useState(false);

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        setRegisterSuccess(false);

        console.log("Attempting registration:", { username, firstName, lastName }); 

        try {

            const res = await fetch('http://localhost:8080/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    password,
                    first: firstName,
                    last: lastName,
                    roles: "USER"
                })
            });

             if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Registration failed! status: ${res.status}, message: ${errorText || res.statusText}`);
            }

            setRegisterSuccess(true);
            setUsername('');
            setPassword('');
            setFirstName('');
            setLastName('');

        } catch (err: any) {
            setError(err.message || "An error occurred during registration.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
         <main className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[calc(100vh-100px)]">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Register</CardTitle>
                </CardHeader>
                 <form onSubmit={handleRegister}>
                    <CardContent className="space-y-4">
                         <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" placeholder="Enter your first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required disabled={isLoading} />
                        </div>
                         <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" placeholder="Enter your last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required disabled={isLoading} />
                        </div>
                        <div>
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" placeholder="Choose a username" value={username} onChange={(e) => setUsername(e.target.value)} required disabled={isLoading} />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" placeholder="Choose a password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
                        </div>
                         {error && <p className="text-red-500 text-sm">{error}</p>}
                         {registerSuccess && <p className="text-green-600 text-sm">Registration Successful! You can now log in.</p>}
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-3">
                        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={isLoading}>
                            {isLoading ? 'Registering...' : 'Register'}
                        </Button>
                        <p className="text-sm text-center text-gray-600">
                             Already have an account?{' '}
                             <Link href="/login" className="text-red-600 hover:underline">
                                 Login here
                             </Link>
                         </p>
                    </CardFooter>
                </form>
            </Card>
        </main>
    );
}
