import { useFormContext } from "react-hook-form";

const InputField = ({
    label = "",
    name,
    type = "text",
    rules,
    placeholder,
    className = ""
}) => {
    const { register, formState: { errors } } = useFormContext();
    const error = errors[name];

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                    {label}
                </label>
            )}
            <input
                type={type}
                placeholder={placeholder}
                {...register(name, rules)}
                className={`
                  w-full px-4 py-2 border rounded-lg outline-none
                  focus:ring-2 focus:ring-blue-500
                  ${error ? "border-red-500 focus:ring-red-400" : "border-gray-300"}
                  ${className}
                `}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
        </div>
    );
};
export default InputField;