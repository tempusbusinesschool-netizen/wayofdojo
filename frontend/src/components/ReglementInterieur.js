import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollText, ChevronDown, ChevronUp, Shield, Heart, Users, Clock, AlertTriangle, UserPlus } from "lucide-react";
import { REGLEMENT_INTERIEUR } from "@/constants";
import MemberRegistrationForm from "./MemberRegistrationForm";

function ReglementInterieur({ onRegister, isAdmin }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedArticles, setExpandedArticles] = useState(new Set());
  const [showRegistration, setShowRegistration] = useState(false);

  const toggleArticle = (articleId) => {
    const newExpanded = new Set(expandedArticles);
    if (newExpanded.has(articleId)) {
      newExpanded.delete(articleId);
    } else {
      newExpanded.add(articleId);
    }
    setExpandedArticles(newExpanded);
  };

  const expandAll = () => {
    setExpandedArticles(new Set(REGLEMENT_INTERIEUR.articles.map(a => a.id)));
  };

  const getIconComponent = (iconName) => {
    const icons = { Shield, Heart, Users, Clock, AlertTriangle, ScrollText };
    return icons[iconName] || ScrollText;
  };

  return (
    <>
      <Card className="mb-8 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                <ScrollText className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-white">{REGLEMENT_INTERIEUR.title}</CardTitle>
                <CardDescription className="text-slate-400">{REGLEMENT_INTERIEUR.subtitle}</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowRegistration(true)}
                className="bg-emerald-600 hover:bg-emerald-500"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Nouvelle inscription
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-slate-400 hover:text-white hover:bg-slate-700"
              >
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {isExpanded && (
          <CardContent className="space-y-4">
            <div className="text-center py-4 border-b border-slate-700">
              <h2 className="text-2xl font-bold text-white">{REGLEMENT_INTERIEUR.clubName}</h2>
              <p className="text-slate-400 text-sm mt-1">{REGLEMENT_INTERIEUR.subtitle}</p>
              <p className="text-slate-500 text-xs mt-2">Document établi le {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={expandAll}
                className="text-cyan-400 hover:text-cyan-300"
              >
                Tout afficher
              </Button>
            </div>
            
            {REGLEMENT_INTERIEUR.articles.map((article) => {
              const IconComponent = getIconComponent(article.icon);
              const isArticleExpanded = expandedArticles.has(article.id);
              
              return (
                <Card key={article.id} className="bg-slate-700/50 border-slate-600">
                  <CardContent className="p-4">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleArticle(article.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-600">
                          <IconComponent className="w-4 h-4 text-cyan-400" />
                        </div>
                        <h3 className="font-semibold text-white text-sm">
                          Article {article.id} - {article.title}
                        </h3>
                      </div>
                      <div className="text-slate-400">
                        {isArticleExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                    
                    {isArticleExpanded && (
                      <div className="mt-4 space-y-2 pl-12">
                        {article.content.map((paragraph, idx) => (
                          <p key={idx} className={`text-slate-300 text-sm leading-relaxed ${!paragraph ? 'h-2' : ''}`}>
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        )}
      </Card>
      
      <Dialog open={showRegistration} onOpenChange={setShowRegistration}>
        <DialogContent className="max-w-2xl bg-slate-900 border-slate-700 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-cyan-400" />
              Nouvelle inscription
            </DialogTitle>
          </DialogHeader>
          <MemberRegistrationForm
            onSuccess={() => {
              setShowRegistration(false);
              if (onRegister) onRegister();
            }}
            onCancel={() => setShowRegistration(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ReglementInterieur;
