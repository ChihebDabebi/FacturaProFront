// Menu configuration for default layout
const menuItemsClient = {
  items: [
    {
      id: 'navigation',
      title: 'Dashboard',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'material-icons-two-tone',
          iconname: 'home',
          url: '/dashboard'

        }
      ]
    },
    {
      id: 'suport',
      title: 'Factures',
      type: 'group',
      icon: 'icon-support',
      children: [

        {
          id: 'invoices',
          title: 'factures',
          type: 'collapse',
          icon: 'material-icons-two-tone',
          iconname: 'request_quote',
          children: [
            {
              id: 'list-invoices',
              title: 'Liste Factures',
              type: 'item',
              url: '/invoices',
            }
          ]
        },
      ]
    }
  ]
};

export default menuItemsClient;
