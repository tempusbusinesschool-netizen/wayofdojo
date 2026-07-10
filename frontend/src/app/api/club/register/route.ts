import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'wayofdojo-secret-key';

// Club/Dojo Schema
const DojoSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String },
  email: { type: String },
  phone: { type: String },
  description: { type: String },
  adminId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

// Club Admin Schema
const ClubAdminSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dojoId: { type: String, required: true },
  role: { type: String, default: 'club_admin' },
  createdAt: { type: Date, default: Date.now }
});

const Dojo = mongoose.models.Dojo || mongoose.model('Dojo', DojoSchema);
const ClubAdmin = mongoose.models.ClubAdmin || mongoose.model('ClubAdmin', ClubAdminSchema);

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { dojo, admin } = body;
    
    // Validate required fields
    if (!dojo?.name || !dojo?.city || !admin?.email || !admin?.password || !admin?.firstName || !admin?.lastName) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }
    
    // Check if admin email already exists
    const existingAdmin = await ClubAdmin.findOne({ email: admin.email.toLowerCase() });
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Un compte existe déjà avec cet email' },
        { status: 400 }
      );
    }
    
    // Generate IDs
    const dojoId = `dojo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const adminId = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Hash password
    const passwordHash = await bcrypt.hash(admin.password, 12);
    
    // Create dojo
    const newDojo = new Dojo({
      id: dojoId,
      name: dojo.name,
      city: dojo.city,
      address: dojo.address || '',
      email: dojo.email || '',
      phone: dojo.phone || '',
      description: dojo.description || '',
      adminId: adminId
    });
    
    // Create admin
    const newAdmin = new ClubAdmin({
      id: adminId,
      email: admin.email.toLowerCase(),
      passwordHash: passwordHash,
      firstName: admin.firstName,
      lastName: admin.lastName,
      dojoId: dojoId
    });
    
    await newDojo.save();
    await newAdmin.save();
    
    return NextResponse.json({
      success: true,
      message: 'Club créé avec succès',
      dojo: {
        id: dojoId,
        name: dojo.name,
        city: dojo.city
      }
    });
    
  } catch (error) {
    console.error('Club register error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du club' },
      { status: 500 }
    );
  }
}
