import { Baby, Users, GraduationCap, Briefcase, Heart } from 'lucide-react';

interface AgeGroup {
  id: string;
  label: string;
  ageRange: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const ageGroups: AgeGroup[] = [
  {
    id: '6-12',
    label: 'Kids',
    ageRange: '6-12 years',
    icon: <Baby className="w-8 h-8" />,
    color: 'from-yellow-400 to-orange-400',
    description: 'Fun learning & creative play'
  },
  {
    id: '13-17',
    label: 'Teens',
    ageRange: '13-17 years',
    icon: <Users className="w-8 h-8" />,
    color: 'from-purple-400 to-pink-400',
    description: 'Study support & emotional guidance'
  },
  {
    id: '18-20',
    label: 'Young Adults',
    ageRange: '18-20 years',
    icon: <GraduationCap className="w-8 h-8" />,
    color: 'from-cyan-400 to-blue-400',
    description: 'Career planning & confidence building'
  },
  {
    id: '21-40',
    label: 'Adults',
    ageRange: '21-40 years',
    icon: <Briefcase className="w-8 h-8" />,
    color: 'from-green-400 to-emerald-400',
    description: 'Life management & personal growth'
  },
  {
    id: 'senior',
    label: 'Seniors',
    ageRange: '60+ years',
    icon: <Heart className="w-8 h-8" />,
    color: 'from-pink-400 to-rose-400',
    description: 'Companionship & health support'
  }
];

interface AgeGroupSelectorProps {
  onSelect: (ageGroup: string) => void;
}

export function AgeGroupSelector({ onSelect }: AgeGroupSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-slate-800">Select Your Age Group</h2>
        <p className="text-gray-600">Choose the category that best fits you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ageGroups.map((group) => (
          <button
            key={group.id}
            onClick={() => onSelect(group.id)}
            className="group relative p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-transparent hover:shadow-xl transition-all duration-300"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${group.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`}></div>
            
            <div className="relative space-y-4">
              <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${group.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                {group.icon}
              </div>
              
              <div className="space-y-1">
                <h3 className="text-slate-800">{group.label}</h3>
                <p className="text-sm text-primary">{group.ageRange}</p>
                <p className="text-sm text-gray-600">{group.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
