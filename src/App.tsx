import './index.css'
import { Provider } from 'react-redux';
import store from './services/store';
import Nav from "./components/Nav";
import UserList from "./components/UserList";

const App: React.FC = () => {

  return (
    <Provider store={store}>
      <Nav />
      <UserList />
    </Provider>
  )
}

export default App
