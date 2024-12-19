"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "next-auth/react";

interface PaymentPageProps {
  rentalId: number;
  amount: number;
}

const PaymentPage = ({ rentalId, amount }: PaymentPageProps) => {
  const [paymentStatus, setPaymentStatus] = useState<"PENDING" | "PAID" | "FAILED">("PENDING");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if the user is logged in
    getSession().then((session) => {
      if (!session) {
        router.push("/auth/login");
      }
    });
  }, [router]);

  const handlePayment = async () => {
    setIsSubmitting(true);

    try {
      // Simulating payment process
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          rentalId,
          amount,
          status: "PAID" // or "FAILED" if the payment fails
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Payment successful!");
        console.log(successMessage);

        setPaymentStatus("PAID");
        // Redirect to the home page after successful payment
        setTimeout(() => router.push("/"), 2000);
      } else {
        setErrorMessage(data.message || "Error processing payment.");
        setPaymentStatus("FAILED");
      }
    } catch (error) {
      setErrorMessage("Something went wrong during payment.");
      setPaymentStatus("FAILED");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Payment for Rental</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p>
              <strong>Rental ID:</strong> {rentalId}
            </p>
            <p>
              <strong>Amount:</strong> ${amount}
            </p>
          </div>

          {paymentStatus === "PENDING" && (
            <>
              <Button
                onClick={handlePayment}
                className="w-full bg-blue-500 hover:bg-blue-600"
                disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Pay Now"}
              </Button>
            </>
          )}

          {paymentStatus === "PAID" && (
            <div className="text-green-500">Payment was successful!</div>
          )}

          {paymentStatus === "FAILED" && (
            <div className="text-red-500">
              {errorMessage || "Payment failed. Please try again."}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentPage;
