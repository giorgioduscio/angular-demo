export function FirebaseMapper(obj:object) {
  let newObject :any =obj
  return Object.keys(newObject) .map(key=>{
    newObject[key]['key']=key
    return newObject[key as keyof object]
  })
}