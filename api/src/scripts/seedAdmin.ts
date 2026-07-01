import mongoose from 'mongoose';
import { User, UserSchema, Role, Status } from '../users/schemas/user.schema';

const SEED_OAUTH_PREFIX = 'seed-admin:';

async function seedAdmin(): Promise<void> {
  const email = (process.env.ADMIN_EMAIL || process.argv[2])?.trim().toLowerCase();
  if (!email) {
    console.error('Error: Set ADMIN_EMAIL in .env or pass an email argument.');
    console.error('Usage: npm run seed:admin -- you@example.com');
    process.exit(1);
  }

  const mongoUri = process.env.MONGO_URI || "";
  const name = process.env.ADMIN_NAME?.trim() || 'Super Admin';
  const city = process.env.ADMIN_CITY?.trim() || 'Admin';
  const force = process.argv.includes('--force');

  await mongoose.connect(mongoUri);
  const UserModel =
    mongoose.models[User.name] || mongoose.model(User.name, UserSchema);

  const existingAdmin = await UserModel.findOne({ role: Role.SUPER_ADMIN });
  if (existingAdmin && existingAdmin.email !== email && !force) {
    console.error(
      `Error: A super admin already exists (${existingAdmin.email}).`,
    );
    console.error('Use --force to promote a different account anyway.');
    await mongoose.disconnect();
    process.exit(1);
  }

  let user = await UserModel.findOne({ email });

  if (user) {
    user.role = Role.SUPER_ADMIN;
    user.status = Status.APPROVED;
    if (!user.city) {
      user.city = city;
    }
    await user.save();
    console.log(`Promoted existing user "${email}" to super admin.`);
  } else {
    user = await UserModel.create({
      email,
      oauthId: `${SEED_OAUTH_PREFIX}${email}`,
      name,
      role: Role.SUPER_ADMIN,
      status: Status.APPROVED,
      city,
    });
    console.log(`Created super admin seed for "${email}".`);
    console.log('Sign in with Google using this email to activate the account.');
  }

  console.log(`  role:   ${user.role}`);
  console.log(`  status: ${user.status}`);
  console.log(`  city:   ${user.city}`);

  await mongoose.disconnect();
}

seedAdmin().catch((error) => {
  console.error('Failed to seed super admin:', error);
  process.exit(1);
});
