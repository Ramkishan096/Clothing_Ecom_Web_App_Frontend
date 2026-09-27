import CategorySection from '../../components/CategorySection/CategorySection'
import { categories } from '../../data/categories';

const CategoryPage = () => {
  return (
      <CategorySection categories={categories} />
  )
}

export default CategoryPage