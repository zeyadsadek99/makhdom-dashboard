
import { usePosStore } from '@/store/pos'

function getMainTable(id: string | number) {
  const posStore = usePosStore()

  return posStore.tables.find((el: TableType) => el.id == id)

}

export default getMainTable
