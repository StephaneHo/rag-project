
import { useRagSearch } from '../hooks/useRagSearch'

export default function SearchPage() {

  const { register, onSubmit, errors, mutation } = useRagSearch()


  return (
    <>
      <form onSubmit={onSubmit}>
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

