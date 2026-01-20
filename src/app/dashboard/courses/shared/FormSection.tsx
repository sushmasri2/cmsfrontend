interface FormSectionProps {
    title: string;
    errors?: string[];
    children: React.ReactNode;
}

export function FormSection({ title, errors, children }: FormSectionProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{title}</h3>
                {errors && errors.length > 0 && (
                    <span className="text-sm text-red-600 font-medium">
                        {errors.length} error{errors.length > 1 ? 's' : ''}
                    </span>
                )}
            </div>
            {errors && errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <ul className="text-sm text-red-700 space-y-1">
                        {errors.map((error, index) => (
                            <li key={index} className="flex items-start">
                                <span className="text-red-500 mr-2">•</span>
                                {error}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {children}
        </div>
    );
}