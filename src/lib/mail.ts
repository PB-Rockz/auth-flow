import {Resend} from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY!);

 const domain = process.env.NEXT_PUBLIC_APP_URL;
export const sendVerficationEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;
    await resend.emails.send({
        from:"onboarding@resend.dev",
        to: email,
        subject:"Verify your email",
        html:`<p>Click <a href="${confirmLink}">here</a> to verify your email.</p>`
    })
    console.log("Email sent!");
}

export const sendTwoFactorEmail = async (email: string, token: string) => {
    await resend.emails.send({
        from:"onboarding@resend.dev",
        to: email,
        subject:"2FA CODE",
        html:`<p>Your 2FA CODE is "${token}"></p>`
    })
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${domain}/auth/new-password?token=${token}`;
    await resend.emails.send({
        from:"onboarding@resend.dev",
        to: email,
        subject:"Reset your password",
        html:`<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`

    })
}