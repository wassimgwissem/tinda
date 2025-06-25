// Import React's useState hook for managing component state
import { useState } from "react";
// Import API functions for password reset functionality
import { updatePassword, verifyResetCode, resetPassword } from "../utils/api";

// Define the ForgotPasswordPopup component that accepts an onClose prop
export default function ForgotPasswordPopup({ onClose }) {
    // State for storing the user's email
    const [email, setEmail] = useState("");
    // State for storing the verification code
    const [code, setCode] = useState("");
    // State for storing the new password
    const [newPassword, setNewPassword] = useState("");
    // State to track which step of the process we're on (1-3)
    const [step, setStep] = useState(1); // 1 = email, 2 = code, 3 = new password
    // State to track if an API request is loading
    const [loading, setLoading] = useState(false);
    // State to store any error messages
    const [error, setError] = useState("");
    // State to track if password reset was successful
    const [success, setSuccess] = useState(false);

    // Handler for sending the verification email
    const handleSendEmail = async (e) => {
        e.preventDefault(); // Prevent form submission default behavior
        setLoading(true); // Show loading state
        setError(""); // Clear any previous errors
        try {
            // Call API to send verification email
            const res = await updatePassword(email);
            if (res.success) {
                setStep(2); // Move to next step if successful
            } else {
                setError(res.error || "Failed to send code."); // Show error
            }
        } catch (err) {
            // Handle API call errors
            setError(err.response?.data?.error || "Failed to send code.");
        }
        setLoading(false); // Hide loading state
    };

    // Handler for verifying the reset code
    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            // Call API to verify the code
            const res = await verifyResetCode(email, code);
            if (res.success) {
                setStep(3); // Move to password reset step if valid
            } else {
                setError(res.error || "Invalid code.");
            }
        } catch (err) {
            setError(err.response?.data?.error || "Invalid code.");
        }
        setLoading(false);
    };

    // Handler for resetting the password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            // Call API to reset password
            const res = await resetPassword(email, code, newPassword);
            if (res.success) {
                setSuccess(true); // Show success message
                // Close popup after 2 seconds
                setTimeout(() => {
                    handleClose();
                }, 2000);
            } else {
                setError(res.error || "Failed to reset password.");
            }
        } catch (err) {
            setError(err.response?.data?.error || "Failed to reset password.");
        }
        setLoading(false);
    };

    // Handler for closing the popup and resetting state
    const handleClose = () => {
        // Reset all state to initial values
        setStep(1);
        setEmail("");
        setCode("");
        setNewPassword("");
        setError("");
        setSuccess(false);
        // Call the onClose prop function
        onClose();
    };

    // Component rendering
    return (
        // Overlay div (semi-transparent background)
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
             style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
            
            {/* Main popup container */}
            <div className="bg-white rounded-4 p-4 p-md-5 shadow-lg" style={{ width: '100%', maxWidth: '500px' }}>
                
                {/* Header section with title and close button */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0">
                        {/* Dynamic title based on current step */}
                        {step === 1 && "Forgot Password"}
                        {step === 2 && "Verify Code"}
                        {step === 3 && "New Password"}
                    </h2>
                    {/* Close button */}
                    <button 
                        className="btn-close" 
                        onClick={handleClose}
                        disabled={loading} // Disable while loading
                    />
                </div>

                {/* Step 1: Email input form */}
                {step === 1 && (
                    <form onSubmit={handleSendEmail}>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="btn btn-dark w-100" 
                            disabled={loading} // Disable while loading
                        >
                            {/* Show loading text if loading */}
                            {loading ? "Sending..." : "Send Code"}
                        </button>
                    </form>
                )}

                {/* Step 2: Verification code form */}
                {step === 2 && (
                    <form onSubmit={handleVerifyCode}>
                        <div className="mb-3">
                            <label className="form-label">Verification Code</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                            />
                            <div className="form-text">
                                Check your email for the verification code
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            className="btn btn-dark w-100" 
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Verify Code"}
                        </button>
                    </form>
                )}

                {/* Step 3: New password form */}
                {step === 3 && (
                    <form onSubmit={handleResetPassword}>
                        <div className="mb-3">
                            <label className="form-label">New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="btn btn-dark w-100" 
                            disabled={loading || success} // Disable if loading or already succeeded
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                )}

                {/* Error message display */}
                {error && (
                    <div className="alert alert-danger mt-3 mb-0">
                        {error}
                    </div>
                )}

                {/* Success message display */}
                {success && (
                    <div className="alert alert-success mt-3 mb-0">
                        Password updated successfully! You can now log in.
                    </div>
                )}
            </div>
        </div>
    );
}