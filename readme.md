# Aragon Core

**Disclaimer: everything in this repository is experimental software.**

**It is not secure to use this code for production usage until proper security audits have been conducted.**

### Architecture

![](rsc/architecture.jpg)

### Refactor state

The [master](../../tree/master) branch of this repo is the ongoing refactor to the new, more modular architecture. Even though it compiles, it is currently not possible to run a full DAO using this branch.

The version of the contracts that are ran in the latest release of the [Aragon dApp](../../../aragon-dapp) lives in the [monolith](../../tree/monolith) branch.

This refactor will be released with Aragon v0.4.

A vague representation of the state of the refactor can be found here:

#### Kernel

- [x] Vanilla ETH transactions
- [x] Presigned ETH transactions
- [x] ERC223 token receiver
- [x] Human Token approveAndCall receiver

#### Organs

- [x] Dispatcher organ
- [x] Meta organ
- [ ] ~~Token vault organ.~~ Removed
- [x] Governance tokens organ
- [x] Applications organ

#### Apps

- [x] Bylaws (yet to be connected to Governance app)
- [x] Governance (adapt former VotingLib)
- [x] Capital (yet to be connected to MiniMe logic)
- [x] Roles
- [ ] WIP: Accounting and transactions (multi-token)

#### Misc
- [x] Transition own Governance Token logic and use MiniMe
- [ ] ~~Vote delegation with MiniMe~~ Not v0.4
- [ ] Default bylaw installation for all apps and DAOs
- [ ] ~~Update dapp to new event names and sources~~ Cancelled
- [ ] Update org factory to configure basic DAO
