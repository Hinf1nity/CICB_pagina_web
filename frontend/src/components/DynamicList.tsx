import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Plus, X } from 'lucide-react';

interface DynamicListProps {
  label: string;
  placeholder?: string;
  items: string[];
  onChange: (items: string[]) => void;
  required?: boolean;
}

export function DynamicList({ label, placeholder, items, onChange, required = false }: DynamicListProps) {
  const handleAddItem = () => {
    onChange([...items, '']);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  const handleChangeItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };

  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => handleChangeItem(index, e.target.value)}
              placeholder={placeholder || `${label} ${index + 1}`}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleRemoveItem(index)}
              disabled={items.length === 1}
              className="shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={handleAddItem}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar {label}
        </Button>
      </div>
    </div>
  );
}
