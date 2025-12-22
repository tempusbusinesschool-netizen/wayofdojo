import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Trash2, Baby, User, Phone, Mail, MapPin, AlertTriangle } from "lucide-react";

function MemberCard({ member, onValidate, onDelete, onValidateChild, onDeleteChild, isChild = false, parentInfo = null }) {
  const getStatusBadge = (status) => {
    const config = {
      pending: { label: "En attente", color: "bg-amber-500" },
      active: { label: "Actif", color: "bg-emerald-500" },
      inactive: { label: "Inactif", color: "bg-slate-500" }
    };
    const { label, color } = config[status] || config.pending;
    return <Badge className={`${color} text-white text-xs`}>{label}</Badge>;
  };

  if (isChild) {
    const childStatus = member.status || 'pending';
    return (
      <Card className="bg-slate-700/50 border-slate-600">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                {parentInfo?.member_id && (
                  <Badge className="bg-slate-600 text-cyan-300 text-xs font-mono">
                    {parentInfo.member_id}
                  </Badge>
                )}
                <span className="font-semibold text-white flex items-center gap-2">
                  <Baby className="w-4 h-4 text-purple-400" />
                  {member.first_name} {member.last_name}
                </span>
                {getStatusBadge(childStatus)}
              </div>
              {member.birth_date && (
                <p className="text-sm text-slate-400">
                  Né(e) le : {new Date(member.birth_date).toLocaleDateString('fr-FR')}
                </p>
              )}
              <div className="text-xs text-slate-500 mt-2 p-2 bg-slate-800/50 rounded">
                <p className="font-medium text-slate-400">Responsable :</p>
                <p className="text-slate-300">{parentInfo?.parent_first_name} {parentInfo?.parent_last_name}</p>
                <p className="flex items-center gap-1 mt-1">
                  <Phone className="w-3 h-3" /> {parentInfo?.phone}
                </p>
                {parentInfo?.emergency_contact && (
                  <p className="flex items-center gap-1 text-orange-400">
                    <AlertTriangle className="w-3 h-3" /> Urgence: {parentInfo.emergency_contact}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 ml-2">
              {childStatus === 'pending' && (
                <Button
                  size="sm"
                  onClick={() => onValidateChild && onValidateChild(parentInfo?.id, member.id)}
                  className="bg-emerald-600 hover:bg-emerald-500"
                  title="Valider l'inscription"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDeleteChild && onDeleteChild(parentInfo?.id, member.id, `${member.first_name} ${member.last_name}`)}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                title="Supprimer l'inscription"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-700/50 border-slate-600">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              {member.member_id && (
                <Badge className="bg-slate-600 text-cyan-300 text-xs font-mono">
                  {member.member_id}
                </Badge>
              )}
              <span className="font-semibold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" />
                {member.parent_first_name} {member.parent_last_name}
              </span>
              {getStatusBadge(member.status)}
              <Badge className="bg-cyan-600 text-white text-xs">Adulte adhérent</Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-400 flex-wrap">
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" /> {member.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" /> {member.phone}
              </span>
            </div>
            {(member.address || member.city || member.postal_code) && (
              <div className="flex items-center gap-1 text-sm text-slate-400">
                <MapPin className="w-3 h-3" />
                {[member.address, member.postal_code, member.city].filter(Boolean).join(', ')}
              </div>
            )}
            {member.emergency_contact && (
              <div className="flex items-center gap-1 text-sm text-orange-400">
                <AlertTriangle className="w-3 h-3" />
                Urgence: {member.emergency_contact}
              </div>
            )}
            {member.reglement_signed_date && (
              <p className="text-xs text-emerald-400">
                ✓ Règlement signé le {new Date(member.reglement_signed_date).toLocaleDateString('fr-FR')}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {member.status === 'pending' && (
              <Button
                size="sm"
                onClick={() => onValidate(member.id)}
                className="bg-emerald-600 hover:bg-emerald-500"
              >
                <CheckCircle2 className="w-4 h-4" />
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(member.id)}
              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MemberCard;
