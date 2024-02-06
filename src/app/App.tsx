import { test } from './features/companiesSlice'
import { useAppDispatch, useAppSelector } from './store/hooks'

function App() {
 const str = useAppSelector((state) => state.companies.str)
 const dispatch = useAppDispatch()

 return (
  <>
   <div>{str}</div>
   <button onClick={() => dispatch(test(`${str} World`))}>click</button>
  </>
 )
}

export default App
