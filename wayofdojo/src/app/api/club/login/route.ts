import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'wayofdojo-secret-key';

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

// Dojo Schema
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

const ClubAdmin = mongoose.models.ClubAdmin || mongoose.model('ClubAdmin', ClubAdminSchema);
const Dojo = mongoose.models.Dojo || mongoose.model('Dojo', DojoSchema);

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }
    
    // Find admin by email
    const admin = await ClubAdmin.findOne({ email: email.toLowerCase() });
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }
    
    // Get dojo info
    const dojo = await Dojo.findOne({ id: admin.dojoId });
    
    if (!dojo) {
      return NextResponse.json(
        { error: 'Dojo non trouvé' },
        { status: 404 }
      );
    }
    
    // Generate JWT token
    const token = jwt.sign(
      {
        adminId: admin.id,
        email: admin.email,
        dojoId: admin.dojoId,
        role: 'club_admin'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return NextResponse.json({
      success: true,
      token: token,
      admin: {
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName
      },
      dojo: {
        id: dojo.id,
        name: dojo.name,
        city: dojo.city,
        address: dojo.address,
        email: dojo.email,
        phone: dojo.phone
      }
    });
    
  } catch (error) {
    console.error('Club login error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
}
