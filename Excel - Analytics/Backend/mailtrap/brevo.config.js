// brevo.config.js - COMPLETE FILE - Replace everything in your file with this
import SibApiV3Sdk from 'sib-api-v3-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Brevo client
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

// Create transactional emails API instance
export const transactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi();

// Sender configuration
export const sender = {
    email: process.env.SENDER_EMAIL,
    name: process.env.SENDER_NAME || "Exceleron"
};

// Validate environment variables
const validateConfig = () => {
    const errors = [];
    
    if (!process.env.BREVO_API_KEY) {
        errors.push('BREVO_API_KEY is missing');
    }
    
    if (!process.env.SENDER_EMAIL) {
        errors.push('SENDER_EMAIL is missing');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(process.env.SENDER_EMAIL)) {
        errors.push('SENDER_EMAIL format is invalid');
    }
    
    if (errors.length > 0) {
        throw new Error(`Brevo configuration errors: ${errors.join(', ')}`);
    }
    
    console.log('✅ Brevo configuration validated successfully');
    console.log('Sender email:', process.env.SENDER_EMAIL);
    console.log('API Key prefix:', process.env.BREVO_API_KEY?.substring(0, 10) + '...');
};

// Main email sending function - THE EXPORT YOUR emails.js IS LOOKING FOR
export const sendEmail = async (to, subject, htmlContent, templateId = null, templateParams = null) => {
    try {
        // Validate configuration before sending
        validateConfig();
        
        // Validate input parameters
        if (!to) {
            throw new Error('Recipient email is required');
        }
        
        if (!subject) {
            throw new Error('Email subject is required');
        }
        
        if (!htmlContent && !templateId) {
            throw new Error('Either htmlContent or templateId is required');
        }
        
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        
        sendSmtpEmail.sender = sender;
        sendSmtpEmail.to = Array.isArray(to) ? to : [{ email: to }];
        sendSmtpEmail.subject = subject;
        
        if (templateId && templateParams) {
            sendSmtpEmail.templateId = templateId;
            sendSmtpEmail.params = templateParams;
        } else {
            sendSmtpEmail.htmlContent = htmlContent;
            // Add text content fallback
            sendSmtpEmail.textContent = htmlContent.replace(/<[^>]*>/g, '');
        }
        
        // Log the email data being sent (without sensitive info)
        console.log('📧 Sending email:', {
            to: sendSmtpEmail.to,
            subject: sendSmtpEmail.subject,
            sender: sendSmtpEmail.sender,
            hasHtmlContent: !!sendSmtpEmail.htmlContent,
            templateId: sendSmtpEmail.templateId
        });
        
        const response = await transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
        console.log('✅ Email sent successfully:', {
            messageId: response.messageId,
            to: sendSmtpEmail.to[0].email
        });
        return response;
        
    } catch (error) {
        // Enhanced error logging
        console.error('❌ Error sending email:', {
            message: error.message,
            status: error.status,
            statusCode: error.statusCode,
            response: error.response?.text || error.response?.body,
            headers: error.response?.headers,
            to: to,
            subject: subject
        });
        
        // Provide more specific error messages
        if (error.status === 400) {
            throw new Error(`Bad Request: Check your email content and recipient format. ${error.message}`);
        } else if (error.status === 401) {
            throw new Error(`Unauthorized: Check your Brevo API key. ${error.message}`);
        } else if (error.status === 403) {
            throw new Error(`Forbidden: Your API key may not have email sending permissions. ${error.message}`);
        } else if (error.status === 500) {
            throw new Error(`Brevo Server Error: This is likely a temporary issue with Brevo's servers. ${error.message}`);
        } else {
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }
};

// Test function to validate API connection
export const testBrevoConnection = async () => {
    try {
        validateConfig();
        
        // Test with a simple email structure
        const testEmail = new SibApiV3Sdk.SendSmtpEmail();
        testEmail.sender = sender;
        testEmail.to = [{ email: sender.email }]; // Send to self for testing
        testEmail.subject = "Brevo API Test - " + new Date().toISOString();
        testEmail.htmlContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>🧪 Brevo Test Email</h2>
                <p>This is a test email sent at: ${new Date().toLocaleString()}</p>
                <p><strong>Sender:</strong> ${sender.email}</p>
                <p>If you received this email, your Brevo configuration is working correctly!</p>
            </div>
        `;
        testEmail.textContent = `Brevo Test Email - ${new Date().toLocaleString()}`;
        
        console.log('🧪 Testing Brevo API connection...');
        const response = await transactionalEmailsApi.sendTransacEmail(testEmail);
        console.log('✅ Brevo API test successful:', response.messageId);
        return true;
        
    } catch (error) {
        console.error('❌ Brevo API test failed:', error.message);
        return false;
    }
};