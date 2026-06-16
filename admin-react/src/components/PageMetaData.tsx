type PageMetaDataProps = {
  title: string
  description?: string
  keywords?: string
}

const defaultPageMetaData: PageMetaDataProps = {
  title: 'EZSIM Admin',
  description:
    'Hệ thống quản trị EZSIM — quản lý sản phẩm, đơn hàng, khách hàng và cấu hình website.',
  keywords:
    'EZSIM, admin, quản trị, esim, thẻ cào, đơn hàng, khách hàng',
}

const PageMetaData = ({ title, description = defaultPageMetaData.description, keywords = defaultPageMetaData.keywords }: PageMetaDataProps) => {
  return (
    <>
      <title>{title ? `${title} | ${defaultPageMetaData.title}` : defaultPageMetaData.title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </>
  )
}
export default PageMetaData
