import { useState } from 'react'
import { DocSection, SubSection } from '../docs/DocSection'
import { Breadcrumb, Pagination } from '../components'

export default function NavigationPage() {
  const [page, setPage] = useState(3)

  return (
    <DocSection title="Navigation">
      <SubSection title="Breadcrumb">
        <Breadcrumb items={[
          { label: 'Home', href: '#' },
          { label: 'Projekte', href: '#' },
          { label: 'Design System', href: '#' },
          { label: 'Komponenten' },
        ]} />
      </SubSection>

      <SubSection title="Pagination">
        <Pagination current={page} total={12} onChange={setPage} />
      </SubSection>
    </DocSection>
  )
}