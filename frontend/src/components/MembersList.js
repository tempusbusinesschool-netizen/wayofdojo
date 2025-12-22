import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Baby, User, Plus } from "lucide-react";
import { toast } from "sonner";
import MemberCard from "./MemberCard";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function MembersList({ members, onRefresh, onRegisterChild, onRegisterAdult }) {
  const [activeTab, setActiveTab] = useState("children");

  useEffect(() => {
    const handleTabChange = (event) => {
      if (event.detail === 'children' || event.detail === 'adults') {
        setActiveTab(event.detail);
      }
    };
    window.addEventListener('setMembersTab', handleTabChange);
    return () => window.removeEventListener('setMembersTab', handleTabChange);
  }, []);

  const handleValidate = async (memberId) => {
    try {
      await axios.post(`${API}/members/${memberId}/validate`);
      toast.success("Adhérent validé !");
      onRefresh();
    } catch (error) {
      toast.error("Erreur lors de la validation");
    }
  };

  const handleValidateChild = async (memberId, childId) => {
    try {
      await axios.post(`${API}/members/${memberId}/validate-child/${childId}`);
      toast.success("Enfant validé !");
      onRefresh();
    } catch (error) {
      toast.error("Erreur lors de la validation de l'enfant");
    }
  };

  const handleDeleteChild = async (memberId, childId, childName) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'inscription de ${childName} ?`)) return;
    try {
      await axios.delete(`${API}/members/${memberId}/delete-child/${childId}`);
      toast.success("Inscription de l'enfant supprimée");
      onRefresh();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleDelete = async (memberId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet adhérent ?")) return;
    try {
      await axios.delete(`${API}/members/${memberId}`);
      toast.success("Adhérent supprimé");
      onRefresh();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const allChildren = members.flatMap(member => 
    (member.children || []).map(child => ({
      ...child,
      parentInfo: member
    }))
  );

  const adultMembers = members.filter(member => member.is_adult_member);

  const childrenCount = allChildren.length;
  const adultsCount = adultMembers.length;

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800 border-slate-700 w-full grid grid-cols-2">
          <TabsTrigger 
            value="children" 
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            <Baby className="w-4 h-4 mr-2" />
            Enfants ({childrenCount})
          </TabsTrigger>
          <TabsTrigger 
            value="adults" 
            className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
          >
            <User className="w-4 h-4 mr-2" />
            Adultes ({adultsCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="children" className="mt-4">
          <div className="flex justify-end mb-4">
            <Button
              onClick={onRegisterChild}
              className="bg-purple-600 hover:bg-purple-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Inscrire un enfant
            </Button>
          </div>
          {childrenCount === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Baby className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aucun enfant inscrit</p>
            </div>
          ) : (
            <div className="space-y-3">
              {allChildren.map((child, idx) => (
                <MemberCard
                  key={`child-${child.id || idx}`}
                  member={child}
                  isChild={true}
                  parentInfo={child.parentInfo}
                  onValidate={handleValidate}
                  onValidateChild={handleValidateChild}
                  onDeleteChild={handleDeleteChild}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="adults" className="mt-4">
          <div className="flex justify-end mb-4">
            <Button
              onClick={onRegisterAdult}
              className="bg-cyan-600 hover:bg-cyan-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Inscrire un adulte
            </Button>
          </div>
          {adultsCount === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aucun adulte adhérent</p>
            </div>
          ) : (
            <div className="space-y-3">
              {adultMembers.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  isChild={false}
                  onValidate={handleValidate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Card className="bg-slate-800/50 border-slate-700 mt-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Résumé des inscriptions</span>
            <div className="flex gap-4">
              <span className="flex items-center gap-1 text-purple-400">
                <Baby className="w-4 h-4" /> {childrenCount} enfant(s)
              </span>
              <span className="flex items-center gap-1 text-cyan-400">
                <User className="w-4 h-4" /> {adultsCount} adulte(s)
              </span>
              <span className="flex items-center gap-1 text-slate-300 font-semibold">
                Total: {childrenCount + adultsCount} adhérent(s)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default MembersList;
