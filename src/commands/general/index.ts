import { category } from '../../utils'
import help from './help'
import weather from './weather'
import shorten from './shorten'

export default category('General', [
    help,
    weather,
    shorten
])