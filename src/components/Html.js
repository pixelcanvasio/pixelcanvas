/* @flow */
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { analytics } from '../config';

// TODO estos elementos deberian ir en APP
// como componentes
// TODO el main.css tambien

class Html extends React.Component {

  static defaultProps = {
    styles: [],
    scripts: [],
  };

  props: {
    title: string,
    description: string,
    styles: Array<{
      id: string,
      cssText: string,
    }>,
    scripts: Array<string>,
    // TODO quita esto de aqui puto guarro yo futuro
    code: string,
  };

  render() {
    const { title, description, styles, scripts, code } = this.props;
    return (
      <html className="no-js" lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <title>{title}</title>
          <meta name="description" content={description} />
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
          <meta
            name="viewport"
            content="user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1.0"
          />
          <link rel="apple-touch-icon" href="apple-touch-icon.png" />
          {styles.map(style =>
            <style
              key={style.id}
              id={style.id}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: style.cssText }}
            />,
          )}
          <link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.css" />
          <script src="https://www.google.com/recaptcha/api.js" async defer />
        </head>
        <body>
          <div id="app" />
          <script src="//imasdk.googleapis.com/js/sdkloader/outstream.js" />
          <script
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: code }}
          />
          {scripts.map(script => <script key={script} src={script} />)}
          {analytics.google.trackingId &&
          <script
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html:
            'window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;' +
            `ga('create','${analytics.google.trackingId}','auto');ga('send','pageview')` }}
          />
      }
          {analytics.google.trackingId &&
            <script src="https://www.google-analytics.com/analytics.js" async defer />
          }
        </body>
      </html>
    );
  }
}

export default Html;
