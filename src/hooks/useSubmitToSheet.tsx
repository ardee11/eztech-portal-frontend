import { useState } from "react";
import { submitToGoogleSheet } from "../services/submitToGoogleSheet";

export function useSubmitCompany() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (formData: { [key: string]: string }) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await submitToGoogleSheet(formData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Submission failed");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, success, error };
}
