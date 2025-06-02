import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Edit3, 
  Save, 
  Shield,
  Trophy,
  Clock,
  BarChart3,
  Globe,
  Download
} from "lucide-react";

export default function AccountPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Demo User",
    email: "demo@vertotranslate.com",
    location: "Global",
    joinDate: "January 2025",
    avatar: "",
    bio: "Language enthusiast exploring the world through translation"
  });

  // Mock user statistics
  const stats = {
    totalTranslations: 247,
    languagesUsed: 12,
    savedPhrases: 18,
    daysActive: 45,
    favoriteLanguage: "Spanish",
    translationStreak: 7
  };

  const handleSaveProfile = () => {
    // Save profile changes
    setIsEditing(false);
    console.log('Profile saved:', profile);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Account</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your profile and view your translation activity
        </p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Profile</span>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
              className="flex items-center space-x-2"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback className="text-lg">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  {isEditing ? (
                    <Input
                      value={profile.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  ) : (
                    <p className="text-lg font-medium">{profile.name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Email</Label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">{profile.email}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Bio</Label>
                {isEditing ? (
                  <Input
                    value={profile.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">{profile.bio}</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{profile.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Joined {profile.joinDate}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600">Verified Account</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{stats.totalTranslations}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Translations</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <Globe className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{stats.languagesUsed}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Languages</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <Download className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold">{stats.savedPhrases}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Saved Phrases</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-2xl font-bold">{stats.daysActive}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Days Active</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5" />
            <span>Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <Trophy className="w-6 h-6 text-yellow-600" />
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">First Translation</h4>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">Completed your first translation</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <Globe className="w-6 h-6 text-blue-600" />
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200">Polyglot</h4>
                <p className="text-sm text-blue-600 dark:text-blue-400">Used 10+ languages</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <Clock className="w-6 h-6 text-green-600" />
              <div>
                <h4 className="font-medium text-green-800 dark:text-green-200">Week Streak</h4>
                <p className="text-sm text-green-600 dark:text-green-400">7 days in a row</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium">Most Used Language Pair</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">English → {stats.favoriteLanguage}</p>
                </div>
              </div>
              <Badge variant="secondary">42 translations</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium">Current Streak</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Keep it up!</p>
                </div>
              </div>
              <Badge variant="secondary">{stats.translationStreak} days</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <Download className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="font-medium">Offline Languages</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Downloaded for offline use</p>
                </div>
              </div>
              <Badge variant="secondary">3 languages</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}