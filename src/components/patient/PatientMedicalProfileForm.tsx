import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMedicalProfile } from '@/contexts/MedicalProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import { Gender, bloodTypes, commonChronicConditions, criticalAllergies } from '@/data/medicalProfileData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertCircle, Check, Plus, X, Loader2, Heart, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say'], {
    required_error: 'Please select a gender',
  }),
  bloodType: z.string().optional(),
  emergencyContactName: z.string().max(100).optional(),
  emergencyContactPhone: z.string().max(20).optional(),
  notes: z.string().max(500).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface PatientMedicalProfileFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

export const PatientMedicalProfileForm = ({ open, onOpenChange, onComplete }: PatientMedicalProfileFormProps) => {
  const { user } = useAuth();
  const { myProfile, updateMyProfile, isLoading } = useMedicalProfile();
  
  const [allergies, setAllergies] = useState<string[]>(myProfile?.allergies || []);
  const [chronicConditions, setChronicConditions] = useState<string[]>(myProfile?.chronicConditions || []);
  const [medications, setMedications] = useState<string[]>(myProfile?.medications || []);
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [newMedication, setNewMedication] = useState('');
  
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: myProfile?.firstName || user?.firstName || '',
      lastName: myProfile?.lastName || user?.lastName || '',
      dateOfBirth: myProfile?.dateOfBirth || '',
      gender: myProfile?.gender || undefined,
      bloodType: myProfile?.bloodType || '',
      emergencyContactName: myProfile?.emergencyContactName || '',
      emergencyContactPhone: myProfile?.emergencyContactPhone || '',
      notes: myProfile?.notes || '',
    },
  });
  
  // Update form when profile loads
  useEffect(() => {
    if (myProfile) {
      form.reset({
        firstName: myProfile.firstName,
        lastName: myProfile.lastName,
        dateOfBirth: myProfile.dateOfBirth || '',
        gender: myProfile.gender || undefined,
        bloodType: myProfile.bloodType || '',
        emergencyContactName: myProfile.emergencyContactName || '',
        emergencyContactPhone: myProfile.emergencyContactPhone || '',
        notes: myProfile.notes || '',
      });
      setAllergies(myProfile.allergies);
      setChronicConditions(myProfile.chronicConditions);
      setMedications(myProfile.medications);
    }
  }, [myProfile, form]);
  
  const handleAddAllergy = (allergy: string) => {
    const trimmed = allergy.trim();
    if (trimmed && !allergies.includes(trimmed)) {
      setAllergies([...allergies, trimmed]);
    }
    setNewAllergy('');
  };
  
  const handleAddCondition = (condition: string) => {
    const trimmed = condition.trim();
    if (trimmed && !chronicConditions.includes(trimmed)) {
      setChronicConditions([...chronicConditions, trimmed]);
    }
    setNewCondition('');
  };
  
  const handleAddMedication = (med: string) => {
    const trimmed = med.trim();
    if (trimmed && !medications.includes(trimmed)) {
      setMedications([...medications, trimmed]);
    }
    setNewMedication('');
  };
  
  const onSubmit = async (data: ProfileFormData) => {
    const success = await updateMyProfile({
      ...data,
      gender: data.gender as Gender,
      allergies,
      chronicConditions,
      medications,
    });
    
    if (success) {
      onOpenChange(false);
      onComplete?.();
    }
  };
  
  const isCritical = (allergy: string) => 
    criticalAllergies.some(c => allergy.toLowerCase().includes(c.toLowerCase()));
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Medical Profile
          </DialogTitle>
          <DialogDescription>
            Complete your medical profile to book appointments. This information helps doctors provide better care.
          </DialogDescription>
        </DialogHeader>
        
        {!myProfile?.isComplete && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
            <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-warning">Profile Incomplete</p>
              <p className="text-muted-foreground">Please fill in all required fields to book appointments.</p>
            </div>
          </div>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Basic Information</CardTitle>
                <CardDescription>Required fields are marked with *</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} max={new Date().toISOString().split('T')[0]} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bloodType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {bloodTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            {/* Allergies */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  Allergies
                </CardTitle>
                <CardDescription>List any known allergies (medications, food, environmental)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {allergies.map((allergy, i) => (
                    <Badge 
                      key={i} 
                      variant={isCritical(allergy) ? 'destructive' : 'secondary'}
                      className="gap-1"
                    >
                      {allergy}
                      <button type="button" onClick={() => setAllergies(allergies.filter((_, idx) => idx !== i))}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {allergies.length === 0 && (
                    <span className="text-sm text-muted-foreground">No allergies listed</span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Input 
                    placeholder="Add allergy..." 
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAllergy(newAllergy))}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={() => handleAddAllergy(newAllergy)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs text-muted-foreground mr-1">Quick add:</span>
                  {criticalAllergies.slice(0, 6).map(allergy => (
                    <Button
                      key={allergy}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => handleAddAllergy(allergy)}
                      disabled={allergies.includes(allergy)}
                    >
                      {allergy}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Chronic Conditions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Chronic Conditions</CardTitle>
                <CardDescription>List any ongoing medical conditions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {chronicConditions.map((condition, i) => (
                    <Badge key={i} variant="outline" className="gap-1">
                      {condition}
                      <button type="button" onClick={() => setChronicConditions(chronicConditions.filter((_, idx) => idx !== i))}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {chronicConditions.length === 0 && (
                    <span className="text-sm text-muted-foreground">No conditions listed</span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Input 
                    placeholder="Add condition..." 
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCondition(newCondition))}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={() => handleAddCondition(newCondition)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs text-muted-foreground mr-1">Quick add:</span>
                  {commonChronicConditions.slice(0, 5).map(condition => (
                    <Button
                      key={condition}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => handleAddCondition(condition)}
                      disabled={chronicConditions.includes(condition)}
                    >
                      {condition}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Medications */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Current Medications</CardTitle>
                <CardDescription>List medications you're currently taking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {medications.map((med, i) => (
                    <Badge key={i} variant="secondary" className="gap-1">
                      {med}
                      <button type="button" onClick={() => setMedications(medications.filter((_, idx) => idx !== i))}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {medications.length === 0 && (
                    <span className="text-sm text-muted-foreground">No medications listed</span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Input 
                    placeholder="Add medication (e.g., Aspirin 100mg)..." 
                    value={newMedication}
                    onChange={(e) => setNewMedication(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMedication(newMedication))}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={() => handleAddMedication(newMedication)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Emergency Contact */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Emergency Contact</CardTitle>
                <CardDescription>Someone we can contact in case of emergency</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="emergencyContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="emergencyContactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1-555-0123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            {/* Additional Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any other medical information the doctor should know..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Optional notes about your health history or preferences</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save Profile
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
