import { Version } from "@microsoft/sp-core-library";
import {
  BaseClientSideWebPart,
  PropertyPaneLabel
} from "@microsoft/sp-webpart-base";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from "@microsoft/sp-property-pane";
import { escape } from "@microsoft/sp-lodash-subset";

import styles from "./DeployDemoWebPart.module.scss";
import * as strings from "DeployDemoWebPartStrings";

export interface IDeployDemoWebPartProps {
  description: string;
}

export default class DeployDemoWebPart extends BaseClientSideWebPart<
  IDeployDemoWebPartProps
> {
  public render(): void {
    let config: {
      username: string;
      tenant: string;
      catalogSite: string;
    } = require("./config");

    const appCat: string = config.username;
    this.domElement.innerHTML = `
      <div class="${styles.deployDemo}">
        <div class="${styles.container}">
          <div class="${styles.row}">
            <span class="${styles.title}">Deployment Demo</span>
            <ul>
              <li>One</li>
              <li>${this.manifest.version}</li>
              <li>Use the config pan to display version and other info</li>
            </ul>
          </div>
        </div>
      </div>`;
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        },
        {
          header: {
            description: "About this webpart"
          },
          groups: [
            {
              groupName: "Package Version",
              groupFields: [
                PropertyPaneLabel("emptyLabel", {
                  text: this.manifest.version.toString()
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
