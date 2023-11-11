export default function useFormValidators() {
  const required = (value: any) => !!value || 'Este campo es requerido'
  const requiredFile = (value: any) => {
    return !value || value.length === 1 || 'Archivo requerido'
  }
  const pdfFormat = (v: any) => {
    return (
      !v ||
      (v.length === 1 && v[0].type === 'application/pdf') ||
      'Formato de archivo inválido'
    )
  }
  const length = (v: any) => (v && v.length <= 250) || 'Máximo 250 caracteres'

  return {
    required,
    requiredFile,
    pdfFormat,
    length
  }
}
