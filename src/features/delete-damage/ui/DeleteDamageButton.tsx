import { Button } from '@mantine/core'

interface DeleteDamageButtonProps {
  damageId: number
  onDelete: (id: number) => void
}

function DeleteDamageButton({ damageId, onDelete }: DeleteDamageButtonProps) {
  return (
    <Button variant="subtle" color="red" onClick={() => onDelete(damageId)}>
      Удалить
    </Button>
  )
}

export default DeleteDamageButton
