export interface Iuser {
    name: string,
    email: string,
    password: string,
    _id:string,
    createdAt?:Date,
    updatedAt?:Date,
    Mobile:string,
    passwordResetTokenHash?: string,
    passwordResetExpiresAt?: Date,
    stripeCustomerId?: string,
    stripeSubscriptionId?: string,
    subscriptionStatus?: "free" | "active" | "past_due" | "canceled",
    plan?: "free" | "pro",
    currentPeriodEnd?: Date,
}

export interface RegisterBody {
    name:string,
    email:string,
    password:string,
    Mobile:string,
}

export interface LoginBody {
    email:string,
    password:string,
}

export interface AuthSessionBody {
    rememberMe?: boolean,
}

export interface ForgotPasswordBody {
    email: string,
}

export interface ResetPasswordBody {
    token: string,
    password: string,
}

export interface JWTPayload {
    email?:string,
    userId:string
}

export interface StripeCheckoutBody {
    plan?: "pro",
}