---
id: jiva
title: Troubleshooting OpenEBS - Jiva
keywords:
  - OpenEBS
  - Jiva
  - Jiva troubleshooting
description: This page contains a list of Jiva related troubleshooting information.
---

## General guidelines for troubleshooting

- Contact [OpenEBS Community](/docs/introduction/community) for support.
- Search for similar issues added in this troubleshooting section.
- Search for any reported issues on [StackOverflow under OpenEBS tag](https://stackoverflow.com/questions/tagged/openebs)

[Jiva replica pod logs showing meta file missing entry](#replica-pod-meta-file-error)

### Jiva replica pod logs showing "Failed to find metadata" {#replica-pod-meta-file-error}

Jiva target pod may not be syncing data across all replicas when replica pod logs contains below kind of messages:

```shell hideCopy
level=error msg="Error in request: Failed to find metadata for volume-snap-b72764f0-4ca8-49b1-b9ca-57cb9dfb6fa9.img"
```

**Troubleshooting**:

Perform following steps to restore the missing metadata file of internal snapshots.

- Check all replica pods are in running state. Faulty replica pod will be in `crashloopBackoff` state in OpenEBS 1.0.0 version.

- Find the replica in `RW` mode using mayactl command, consider it as healthy.

- Consider the replica that have above kind of error messages in its logs as faulty.

- Log in to the nodes of healthy and faulty replica and list all the snapshots under `**/var/openebs/<PV-name>**`.

  Example snippet of Healthy replica:

  ```shell hideCopy
  revision.counter                                           volume-snap-792e7036-877d-4807-9641-4843c987d0a5.img
  volume-head-005.img                                        volume-snap-792e7036-877d-4807-9641-4843c987d0a5.img.meta
  volume-head-005.img.meta                                   volume-snap-b72764f0-4ca8-49b1-b9ca-57cb9dfb6fa9.img
  volume-snap-15660574-e47d-4217-ac92-1497e5b654a4.img       volume-snap-b72764f0-4ca8-49b1-b9ca-57cb9dfb6fa9.img.meta
  volume-snap-15660574-e47d-4217-ac92-1497e5b654a4.img.meta  volume-snap-cce9eb61-8f8b-42bd-ba44-8479ada98cee.img
  volume-snap-2ac410ca-2716-4255-94b1-39105b627270.img       volume-snap-cce9eb61-8f8b-42bd-ba44-8479ada98cee.img.meta
  volume-snap-2ac410ca-2716-4255-94b1-39105b627270.img.meta  volume-snap-d9f8d3db-9434-4f16-a5a7-b1b120ceae94.img
  volume-snap-466d32e7-c443-46dd-afdd-8412e76f348e.img       volume-snap-d9f8d3db-9434-4f16-a5a7-b1b120ceae94.img.meta
  volume-snap-466d32e7-c443-46dd-afdd-8412e76f348e.img.meta  volume.meta
  ```

  Example snippet of faulty replica:

  ```shell hideCopy
  revision.counter                                           volume-snap-792e7036-877d-4807-9641-4843c987d0a5.img
  volume-head-005.img                                        volume-snap-792e7036-877d-4807-9641-4843c987d0a5.img.meta
  volume-head-005.img.meta                                   volume-snap-b72764f0-4ca8-49b1-b9ca-57cb9dfb6fa9.img
  volume-snap-15660574-e47d-4217-ac92-1497e5b654a4.img       volume-snap-15660574-e47d-4217-ac92-1497e5b654a4.img.meta  volume-snap-cce9eb61-8f8b-42bd-ba44-8479ada98cee.img
  volume-snap-2ac410ca-2716-4255-94b1-39105b627270.img       volume-snap-cce9eb61-8f8b-42bd-ba44-8479ada98cee.img.meta
  volume-snap-2ac410ca-2716-4255-94b1-39105b627270.img.meta  volume-snap-d9f8d3db-9434-4f16-a5a7-b1b120ceae94.img
  volume-snap-466d32e7-c443-46dd-afdd-8412e76f348e.img       volume-snap-d9f8d3db-9434-4f16-a5a7-b1b120ceae94.img.meta
  volume-snap-466d32e7-c443-46dd-afdd-8412e76f348e.img.meta  volume.meta
  ```

  From above snippet of faulty replica, metadata for the `volume-snap-b72764f0-4ca8-49b1-b9ca-57cb9dfb6fa9.img` snapshot is not present.

- If only one meta file is missing, then copy meta file name and content from one of the healthy replica to the faulty replica.

  For above case, copy `volume-snap-b72764f0-4ca8-49b1-b9ca-57cb9dfb6fa9.img.meta` from healthy replica to faulty replica and restart the faulty replica. You can verify the logs of the replica pod to ensure that there are no error messages as mentioned above.

- If multiple meta files are missing, then delete all files from replica pods and then restart the faulty replica pod to rebuild from healthy replica.

## See Also:

[FAQs](/docs/additional-info/faqs) [Seek support or help](/docs/introduction/community) [Latest release notes](/docs/introduction/releases)
