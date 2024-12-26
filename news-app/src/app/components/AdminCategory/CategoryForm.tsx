import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Category } from '@/types/category';

type CategoryFormData = Pick<Category, 'name' | 'description'>;

interface CategoryFormProps {
    initialData?: CategoryFormData;
    categoryNameError?: string;
    onSubmit: (data: CategoryFormData) => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, categoryNameError, onSubmit }) => {

    const { register, handleSubmit, formState: { errors } } = useForm<CategoryFormData>({ defaultValues: initialData });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Input
                    {...register('name', { required: 'Tên danh mục là bắt buộc' })}
                    placeholder="Tên danh mục"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                {categoryNameError && <p className="text-red-500 text-sm mt-1">{categoryNameError}</p>}
            </div>
            <div>
                <Textarea
                    {...register('description')}
                    placeholder="Mô tả danh mục"
                />
            </div>
            <Button className='bg-[#3498db] hover:bg-[#2980b9]' type="submit">Lưu</Button>
        </form>
    );
};

