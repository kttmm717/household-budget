// frontend/app/(auth)/_components/AuthField.tsx
// ログイン・新規登録フォームの入力欄

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 aria-[invalid=true]:border-rose-400";

export default function AuthField({
  label,
  errors,
  ...inputProps
}: {
  label: string;
  errors?: string[];
} & React.InputHTMLAttributes<HTMLInputElement> & { name: string }) {
  const errorId = `${inputProps.name}-error`;
  return (
    <div>
      <label htmlFor={inputProps.name} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={inputProps.name}
        className={inputClass}
        aria-invalid={!!errors?.length}
        aria-describedby={errors?.length ? errorId : undefined}
        {...inputProps}
      />
      {errors?.length ? (
        <p id={errorId} className="mt-1 text-xs text-rose-600">
          {errors[0]}
        </p>
      ) : null}
    </div>
  );
}
