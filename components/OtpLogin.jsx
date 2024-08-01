"use client"
import { auth } from "../app/firebase"
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
} from "firebase/auth"
import React, {FormEvent, useEffect, useState, useTransition } from "react";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const OtpLogin = () => {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState("");
    
    const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [isPending, startTransition] = useTransition();
    const [resendCountdown, setResendCountdown] = useState(0);

    useEffect(() => {
        let timer;
        if (resendCountdown > 0) {
          timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
        }
        return () => clearTimeout(timer);
      }, [resendCountdown]);


      useEffect(() => {
        const recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            'size': "invisible",
              callback: () => {
        console.log('recaptcha resolved..')
    }
          });
      
        setRecaptchaVerifier(recaptchaVerifier);
      
        return () => {
          recaptchaVerifier.clear();
        };
      }, [auth]);

      const requestOtp = async(e) => {
        e.preventDefault();

        setResendCountdown(60);

        startTransition(async () => {
            setError("");

            if(!recaptchaVerifier) {
                return setError("RecaptchaVerifier is not initialized.");
            }
            try {
                const confirmationResult = await signInWithPhoneNumber(
                    auth,
                    phoneNumber,
                    recaptchaVerifier
                );

                setConfirmationResult(confirmationResult);
                setSuccess("OTP sent successfully.");
            } catch (error) {
                setResendCountdown(0);

                if(error.code === "auth/invalid-phone-number") {
                    setError("Invalid phone number. Please check the number.");
                } else if (error.code === "auth/too-many-requests"){
                    setError("Too many requests. Please try again later.");
                }else{
                    setError("Failed to send OTP. Please try again.")
                }
            }
        });
      };
  return (
      
      <div>
        {!confirmationResult && (
            <form onSubmit={requestOtp}>
                <Input
                    className="text-black"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}

                />
                <p className="text-xs text-gray-400 mt-2">
                    Please enter your number with the country code (i.e. +44 for UK)</p>
            </form>
        )}

        <Button
            disabled={!phoneNumber || isPending || resendCountdown >0}
            onClick={(e) => requestOtp(e)}
            className="mt-5 text-gray-800" 
            >
            {resendCountdown > 0
                ? `Resend OTP in ${resendCountdown}`
                : isPending
                ? "Sending OTP"
                : "Send OTP"
            }</Button>
        <div className="p-10 text-center">
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
        </div>

        <div id="recaptcha-container" />

       
    </div>
  )
}

export default OtpLogin
