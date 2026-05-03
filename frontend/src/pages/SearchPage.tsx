import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { searchRag } from '../api/rag'

const schema = z.object({
  query: z.string().min(3, 'Minimum 3 caractères'),
})



type FormData = z.infer<typeof schema>

export default function SearchPage() {

  const mutation = useMutation({
    mutationFn: searchRag,
  })

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const onSubmit = (data: FormData) => {
    mutation.mutate(data)
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('query')} placeholder='Votre question...' className='border p-2 rounded' />
        {errors.query && <p className="text-red-500 text-sm">{errors.query.message}</p>}
        <button
          type="submit"
          className='bg-blue-500 text-white px-4 py-2 rounded'
          disabled={mutation.isPending}>
          {mutation.isPending ? 'Recherche...' : 'Rechercher'}
        </button>
      </form>
      {mutation.isPending && <p>Recherche en cours...</p>}
      {mutation.isError && <p className="text-red-500">{mutation.error.message}</p>}
      {mutation.data && <p>{mutation.data.answer}</p>}
    </>
  )
}

