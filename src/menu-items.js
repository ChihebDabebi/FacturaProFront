// Menu configuration for default layout
const menuItems = {
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
      id: 'support',
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
            },
            {
              id: 'add-invoice',
              title: 'Ajouter Facture',
              type: 'item',
              url: '/invoices/add',
            },


          ]
        },
      ]
    },
     {
      id: 'suport',
      title: 'Clients',
      type: 'group',
      icon: 'icon-support',
      children: [

        {
          id: 'clients',
          title: 'clients',
          type: 'collapse',
          icon: 'material-icons-two-tone',
          iconname: 'group',
          children: [
            {
              id: 'list-clients',
              title: 'Liste Clients',
              type: 'item',
              url: '/users',
            },
            {
              id: 'add-client',
              title: 'Ajouter Clients',
              type: 'item',
              url: '/user/add',
            },


          ]
        },
      ]
    }
  ]
};

export default menuItems;
