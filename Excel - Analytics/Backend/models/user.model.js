import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
			maxlength: 100
		},
		lastLogin: {
			type: Date,
			default: Date.now,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
		verificationToken: String,
		verificationTokenExpiresAt: Date,



		// --- Fields from main app (User.js) ---
		role: {
			type: String,
			enum: ['user', 'admin'],
			default: 'user'
		},
		status: {
			type: String,
			enum: ['active', 'inactive', 'suspended'],
			default: 'active'
		},
		avatar: {
			type: String,
			default: ''
		},
		preferences: {
			theme: {
				type: String,
				enum: ['dark', 'light'],
				default: 'dark'
			},
			defaultChartType: {
				type: String,
				enum: ['2d', '3d'],
				default: '2d'
			},
			notifications: {
				type: Boolean,
				default: true
			}
		},
		analytics: {
			filesUploaded: { type: Number, default: 0 },
			chartsCreated: { type: Number, default: 0 },
			totalDownloads: { type: Number, default: 0 },
			lastLogin: { type: Date, default: Date.now },
		},
	},
	{ timestamps: true }
);


// --- Indexes for Performance ---
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });

// --- Middleware to Hash Password ---
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	try {
		const salt = await bcrypt.genSalt(12);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error);
	}
});

// --- Methods ---
userSchema.methods.comparePassword = async function (candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.updateAnalytics = function (field, increment = 1) {
	this.analytics[field] = (this.analytics[field] || 0) + increment;
	return this.save();
};


export const User = mongoose.model("User", userSchema);
