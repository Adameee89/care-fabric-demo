import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  HelpCircle,
  Stethoscope,
  Shield,
  AlertCircle,
  Activity,
  ChevronRight,
  Heart,
  Pill,
  Leaf
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIResponseData, AIResponseMetadata } from '@/services/aiHealthcareApi';
import { Badge } from '@/components/ui/badge';

interface AIResponseCardProps {
  response: AIResponseData;
  metadata: AIResponseMetadata;
  disclaimer: string;
}

const AIResponseCard = memo(({ response, metadata, disclaimer }: AIResponseCardProps) => {
  const { t } = useTranslation();
  
  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'High': return 'bg-success/10 text-success border-success/20';
      case 'Moderate': return 'bg-warning/10 text-warning border-warning/20';
      case 'Low': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };
  
  const getEmergencyColor = (level: string) => {
    switch (level) {
      case 'emergency': return 'bg-destructive text-destructive-foreground';
      case 'urgent': return 'bg-warning text-warning-foreground';
      default: return 'bg-primary/10 text-primary';
    }
  };
  
  const getProbabilityColor = (probability: string) => {
    const lower = probability.toLowerCase();
    if (lower.includes('high') || parseFloat(probability) > 0.7) {
      return 'bg-destructive/10 text-destructive border-destructive/30';
    }
    if (lower.includes('moderate') || lower.includes('medium') || (parseFloat(probability) > 0.4 && parseFloat(probability) <= 0.7)) {
      return 'bg-warning/10 text-warning border-warning/30';
    }
    return 'bg-muted text-muted-foreground border-border';
  };
  
  return (
    <div className="space-y-4">
      {/* Metadata badges */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className={cn('gap-1', getConfidenceColor(metadata.confidence))}>
          <Activity className="w-3 h-3" />
          {metadata.confidence} {t('ai.response.confidence', 'Confidence')}
        </Badge>
        
        <Badge variant="outline" className={getEmergencyColor(metadata.emergencyLevel)}>
          {metadata.emergencyLevel === 'emergency' ? '🚨' : metadata.emergencyLevel === 'urgent' ? '⚠️' : '✓'}
          {metadata.emergencyLevel.charAt(0).toUpperCase() + metadata.emergencyLevel.slice(1)}
        </Badge>
        
        {metadata.requiresPhysicianConsult && (
          <Badge variant="outline" className="bg-info/10 text-info border-info/20 gap-1">
            <Stethoscope className="w-3 h-3" />
            {t('ai.response.consultRecommended', 'Consult Recommended')}
          </Badge>
        )}
      </div>
      
      {/* Main message */}
      <div className="bg-muted rounded-xl p-4">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{response.message}</p>
      </div>
      
      {/* Diagnoses - New section */}
      {response.diagnoses && response.diagnoses.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary" />
            </div>
            <h4 className="font-semibold text-sm text-primary">{t('ai.response.possibleConditions', 'Possible Conditions')}</h4>
          </div>
          <div className="space-y-3">
            {response.diagnoses.map((diagnosis, index) => (
              <div key={index} className="bg-background/50 rounded-lg p-3 border border-border/50">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-medium text-sm">{diagnosis.condition}</span>
                  <Badge variant="outline" className={cn('text-xs shrink-0', getProbabilityColor(diagnosis.probability))}>
                    {diagnosis.probability}
                  </Badge>
                </div>
                {diagnosis.description && (
                  <p className="text-xs text-muted-foreground mt-1">{diagnosis.description}</p>
                )}
                {diagnosis.icdCode && (
                  <span className="text-xs text-muted-foreground/70 mt-1 block">ICD: {diagnosis.icdCode}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Specialist Referral */}
      {response.specialistReferral && (
        <div className="bg-info/10 border border-info/20 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-info" />
            <div>
              <span className="font-medium text-sm">{t('ai.response.specialistReferral', 'Recommended Specialist:')}</span>
              <span className="ml-2 text-sm text-info">{response.specialistReferral}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Recommendations */}
      {response.recommendations.length > 0 && (
        <div className="bg-success/5 border border-success/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-success" />
            </div>
            <h4 className="font-semibold text-sm text-success">{t('ai.response.recommendations', 'Recommendations')}</h4>
          </div>
          <ul className="space-y-2">
            {response.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <ChevronRight className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Lifestyle Advice - New section */}
      {response.lifestyle && response.lifestyle.length > 0 && (
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h4 className="font-semibold text-sm text-emerald-600 dark:text-emerald-400">{t('ai.response.lifestyle', 'Lifestyle Advice')}</h4>
          </div>
          <ul className="space-y-2">
            {response.lifestyle.map((advice, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <ChevronRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{advice}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Warnings */}
      {response.warnings.length > 0 && (
        <div className="bg-warning/5 border border-warning/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-warning/20 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-warning" />
            </div>
            <h4 className="font-semibold text-sm text-warning">{t('ai.response.warnings', 'Important Warnings')}</h4>
          </div>
          <ul className="space-y-2">
            {response.warnings.map((warning, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Follow-up questions */}
      {response.followUp.length > 0 && (
        <div className="bg-info/5 border border-info/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-info/20 flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-info" />
            </div>
            <h4 className="font-semibold text-sm text-info">{t('ai.response.followUp', 'Questions to Consider')}</h4>
          </div>
          <ul className="space-y-2">
            {response.followUp.map((question, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="w-5 h-5 rounded-full bg-info/20 text-info text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span>{question}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* References */}
      {response.references.length > 0 && (
        <div className="bg-muted/50 border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
            </div>
            <h4 className="font-semibold text-sm text-muted-foreground">{t('ai.response.references', 'References')}</h4>
          </div>
          <ul className="space-y-1">
            {response.references.map((ref, index) => (
              <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                <span className="text-muted-foreground/50">•</span>
                <span>{ref}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Related specialties */}
      {metadata.topRelatedSpecialties.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs text-muted-foreground">{t('ai.response.relatedSpecialties', 'Related specialties:')}</span>
          {metadata.topRelatedSpecialties.map((specialty, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {specialty}
            </Badge>
          ))}
        </div>
      )}
      
      {/* Disclaimer */}
      <div className="flex items-start gap-2 pt-2 border-t border-border">
        <Shield className="w-4 h-4 text-warning shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">{disclaimer}</p>
      </div>
    </div>
  );
});

AIResponseCard.displayName = 'AIResponseCard';

export default AIResponseCard;
