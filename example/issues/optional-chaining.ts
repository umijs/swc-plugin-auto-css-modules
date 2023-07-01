import assert from 'assert'
import { transform } from '../_do'

// case1
// Layout.tsx
const result = transform(`
import { Link, useLocation, useNavigate, Outlet, useAppData, useRouteData, matchRoutes } from 'umi';
import type { IRoute } from 'umi';
import React, { useMemo } from 'react';
import {
  ProLayout,
} from "/Users/ryu/Documents/development/code/umi-4/demo-check/max-4.0.68/node_modules/@ant-design/pro-components";
import './Layout.less';
import Logo from './Logo';
import Exception from './Exception';
import { getRightRenderContent } from './rightRender';
import { useModel } from '@@/plugin-model';
import { useAccessMarkedRoutes } from '@@/plugin-access';
import { useIntl } from '@@/plugin-locale';

// 过滤出需要显示的路由, 这里的filterFn 指 不希望显示的层级
const filterRoutes = (routes: IRoute[], filterFn: (route: IRoute) => boolean) => {
  if (routes.length === 0) {
    return []
  }

  let newRoutes = []
  for (const route of routes) {
    const newRoute = {...route };
    if (filterFn(route)) {
      if (Array.isArray(newRoute.routes)) {
        newRoutes.push(...filterRoutes(newRoute.routes, filterFn))
      }
    } else {
      if (Array.isArray(newRoute.children)) {
        newRoute.children = filterRoutes(newRoute.children, filterFn);
        newRoute.routes = newRoute.children;
      }
      newRoutes.push(newRoute);
    }
  }

  return newRoutes;
}

// 格式化路由 处理因 wrapper 导致的 菜单 path 不一致
const mapRoutes = (routes: IRoute[]) => {
  if (routes.length === 0) {
    return []
  }
  return routes.map(route => {
    // 需要 copy 一份, 否则会污染原始数据
    const newRoute = {...route}
    if (route.originPath) {
      newRoute.path = route.originPath
    }

    if (Array.isArray(route.routes)) {
      newRoute.routes = mapRoutes(route.routes);
    }

    if (Array.isArray(route.children)) {
      newRoute.children = mapRoutes(route.children);
    }

    return newRoute
  })
}

export default (props: any) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clientRoutes, pluginManager } = useAppData();
  const initialInfo = (useModel && useModel('@@initialState')) || {
    initialState: undefined,
    loading: false,
    setInitialState: null,
  };
  const { initialState, loading, setInitialState } = initialInfo;
  const userConfig = {
  "title": "@umijs/max"
};
const { formatMessage } = useIntl();
  const runtimeConfig = pluginManager.applyPlugins({
    key: 'layout',
    type: 'modify',
    initialValue: {
      ...initialInfo
    },
  });


  // 现在的 layout 及 wrapper 实现是通过父路由的形式实现的, 会导致路由数据多了冗余层级, proLayout 消费时, 无法正确展示菜单, 这里对冗余数据进行过滤操作
  const newRoutes = filterRoutes(clientRoutes.filter(route => route.id === 'ant-design-pro-layout'), (route) => {
    return (!!route.isLayout && route.id !== 'ant-design-pro-layout') || !!route.isWrapper;
  })
  const [route] = useAccessMarkedRoutes(mapRoutes(newRoutes));

  const matchedRoute = useMemo(() => matchRoutes(route.children, location.pathname)?.pop?.()?.route, [location.pathname]);

  return (
    <ProLayout
      route={route}
      location={location}
      title={userConfig.title || 'plugin-layout'}
      navTheme="dark"
      siderWidth={256}
      onMenuHeaderClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        navigate('/');
      }}
      formatMessage={userConfig.formatMessage || formatMessage}
      menu={{ locale: userConfig.locale }}
      logo={Logo}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children) {
          return defaultDom;
        }
        if (menuItemProps.path && location.pathname !== menuItemProps.path) {
          return (
            // handle wildcard route path, for example /slave/* from qiankun
            <Link to={menuItemProps.path.replace('/*', '')} target={menuItemProps.target}>
              {defaultDom}
            </Link>
          );
        }
        return defaultDom;
      }}
      itemRender={(route, _, routes) => {
        const { breadcrumbName, title, path } = route;
        const label = title || breadcrumbName
        const last = routes[routes.length - 1]
        if (last) {
          if (last.path === path || last.linkPath === path) {
            return <span>{label}</span>;
          }
        }
        return <Link to={path}>{label}</Link>;
      }}
      disableContentMargin
      fixSiderbar
      fixedHeader
      {...runtimeConfig}
      rightContentRender={
        runtimeConfig.rightContentRender !== false &&
        ((layoutProps) => {
          const dom = getRightRenderContent({
            runtimeConfig,
            loading,
            initialState,
            setInitialState,
          });
          if (runtimeConfig.rightContentRender) {
            return runtimeConfig.rightContentRender(layoutProps, dom, {
              // BREAK CHANGE userConfig > runtimeConfig
              userConfig,
              runtimeConfig,
              loading,
              initialState,
              setInitialState,
            });
          }
          return dom;
        })
      }
    >
      <Exception
        route={matchedRoute}
        noFound={runtimeConfig?.noFound}
        notFound={runtimeConfig?.notFound}
        unAccessible={runtimeConfig?.unAccessible}
        noAccessible={runtimeConfig?.noAccessible}
      >
        {runtimeConfig.childrenRender
          ? runtimeConfig.childrenRender(<Outlet />, props)
          : <Outlet />
        }
      </Exception>
    </ProLayout>
  );
}
`)

assert(
  result.code.length > 0
)

// case2

const result2 = transform(`
import React, { useEffect, useState } from 'react';
import { ApplyPluginsType } from 'umi';
import { renderClient, RenderClientOpts } from '/Users/ryu/Documents/development/code/umi-4/demo-check/app-4.0.69/node_modules/.pnpm/@umijs+renderer-react@4.0.72_react-dom@18.1.0_react@18.1.0/node_modules/@umijs/renderer-react';
import { createHistory } from './core/history';
import { createPluginManager } from './core/plugin';
import { getRoutes } from './core/route';
import type { Location } from 'history';

const publicPath = '/';
const runtimePublicPath = false;

type TestBrowserProps = {
  location?: Partial<Location>;
  historyRef?: React.MutableRefObject<Location>;
};
export function TestBrowser(props: TestBrowserProps) {
  const pluginManager = createPluginManager();
  const [context, setContext] = useState<RenderClientOpts | undefined>(
    undefined
  );
  useEffect(() => {
    const genContext = async () => {
      const { routes, routeComponents } = await getRoutes(pluginManager);
      // allow user to extend routes
      await pluginManager.applyPlugins({
        key: 'patchRoutes',
        type: ApplyPluginsType.event,
        args: {
          routes,
          routeComponents,
        },
      });
      const contextOpts = pluginManager.applyPlugins({
        key: 'modifyContextOpts',
        type: ApplyPluginsType.modify,
        initialValue: {},
      });
      const basename = contextOpts.basename || '/';
      const history = createHistory({
        type: 'memory',
        basename,
      });
      const context = {
        routes,
        routeComponents,
        pluginManager,
        rootElement: contextOpts.rootElement || document.getElementById('root'),
        publicPath,
        runtimePublicPath,
        history,
        basename,
        components: true,
      };
      const modifiedContext = pluginManager.applyPlugins({
        key: 'modifyClientRenderOpts',
        type: ApplyPluginsType.modify,
        initialValue: context,
      });
      return modifiedContext;
    };
    genContext().then((context) => {
      setContext(context);
      if (props.location) {
        context?.history?.push(props.location);
      }
      if (props.historyRef) {
        props.historyRef.current = context?.history;
      }
    });
  }, []);

  if (context === undefined) {
    return <div id="loading" />;
  }

  const Children = renderClient(context);
  return (
    <React.Fragment>
      <Children />
    </React.Fragment>
  );
}
`)

assert(
  result2.code.length > 0
)
