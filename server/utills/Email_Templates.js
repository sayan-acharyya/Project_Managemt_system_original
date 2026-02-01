export function generateForgotPasswordEmailTemplate(resetPasswordUrl) {
    return `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2>Password Reset Request</h2>
            <p>You requested to reset your password.</p>
            <p>Click the button below to reset it. This link is valid for a limited time.</p>

            <a 
                href="${resetPasswordUrl}" 
                style="
                    display: inline-block;
                    padding: 10px 20px;
                    margin: 20px 0;
                    background-color: #4f46e5;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: bold;
                "
            >
                Reset Password
            </a>

            <p>If you did not request this, please ignore this email.</p>

            <p style="font-size: 12px; color: #777;">
                If the button doesn’t work, copy and paste this URL into your browser:<br/>
                ${resetPasswordUrl}
            </p>

            <p>— Project Management System Team</p>
        </div>
    `;
}
