export default function onList(
  list,
  eventType,
  id,
  prevId,
  value,
  idProp,
  ItemRecord
) {
  const findIdx = id => list.findIndex(item => item[idProp] === id);
  const currentIdx = findIdx(id);
  // console.log(eventType, id, prevId)
  // Note updates check currect state because re-registration etc.
  switch (eventType) {
    case 'child_removed':
      if (currentIdx === -1) return list;
      return list.delete(currentIdx);
    case 'child_changed':
      if (currentIdx === -1) return list;
      return list.splice(currentIdx, 1, list.get(currentIdx).merge(value));
    case 'child_moved':
      if (currentIdx === -1) return list;
      return list
        .delete(currentIdx)
        .insert(prevId ? findIdx(prevId) : 0, list.get(currentIdx));
    case 'child_added': {
      if (currentIdx !== -1) list = list.delete(currentIdx);
      return list.insert(prevId ? findIdx(prevId) : 0, new ItemRecord(value));
    }
  }
  return list;
}
