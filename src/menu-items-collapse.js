// Menu configuration for default layout
const menuItems = {
  items: [
    {
      id: 'navigation',
      title: 'Navigation',
      type: 'group',

      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'collapse',
          children: [
            {
              id: 'sales',
              title: 'Sales',
              type: 'item',
              url: '/dashboard/sales'
            }
          ]
        }
      ]
    },
    {
      type: 'group',
      id: 'components-group',
      children: [
        {
          id: 'typography',
          title: 'Typography',
          type: 'item',
          url: '/typography'
        },
        {
          id: 'color',
          title: 'Color',
          type: 'item',
          url: '/color'
        },
        {
          id: 'icons',
          title: 'Icons',
          type: 'collapse',
          children: [
            {
              id: 'feather',
              title: 'Feather',
              type: 'item',
              url: '/icons/Feather'
            },
            {
              id: 'font-awesome-5',
              title: 'Font Awesome',
              type: 'item',
              url: '/icons/font-awesome-5'
            },
            {
              id: 'material',
              title: 'Material',
              type: 'item',
              url: '/icons/material'
            }
          ]
        }
      ]
    },
    {
      id: 'pages',
      title: 'Pages',
      subtitle: '15+ Redymade Pages',
      type: 'group',
      icon: 'icon-pages',
      children: [
        {
          id: 'login',
          title: 'Login',
          type: 'item',
          icon: 'material-icons-two-tone',
          iconname: 'verified_user',
          url: '/login'
        },
        {
          id: 'register',
          title: 'Register',
          type: 'item',
          icon: 'material-icons-two-tone',
          iconname: 'person_add_alt_1',
          url: '/register'
        }
      ]
    },
    {
      id: 'support',
      title: 'OTHER',
      subtitle: 'Extra More Things',
      type: 'group',
      icon: 'icon-support',
      children: [
        {
          id: 'invoices',
          title: 'Invoices',
          type: 'collapse',
          icon: 'material-icons-two-tone',
          iconname: 'request_quote',
          children: [
            {
              id: 'list-invoices',
              title: 'List Invoices',
              type: 'item',
              url: '/invoices',
            },
            {
              id: 'add-invoice',
              title: 'Ajouter une facture',
              type: 'item',
              url: '/invoices/add',
            }
          ]
        },
        {
          id: 'disabled-menu',
          title: 'Disabled Menu',
          type: 'item',
          url: '#',
          classes: 'nav-item disabled',
          icon: 'material-icons-two-tone',
          iconname: 'power_off'
        }
       
      ]
    }
  ]
};

export default menuItems;
