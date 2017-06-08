const assertThrow = require('./helpers/assertThrow');
var DAO = artifacts.require('DAO');
var MetaOrgan = artifacts.require('MetaOrgan')
var DispatcherOrgan = artifacts.require('DispatcherOrgan')
var Kernel = artifacts.require('Kernel')
var EtherToken = artifacts.require('EtherToken')
var MockedOrgan = artifacts.require('./helpers/MockedOrgan')
const { sign } = require('./helpers/web3')

const createDAO = () => DAO.new({ gas: 9e6 })

const zerothAddress = '0x'
const randomAddress = '0x0000000000000000000000000000000000001234'

contract('Dispatcher', accounts => {
  let dao, metadao, kernel, mockedOrgan = {}

  beforeEach(async () => {
    dao = await createDAO()
    metadao = MetaOrgan.at(dao.address)
    kernel = Kernel.at(dao.address)

    const mockOrgan = await MockedOrgan.new()
    await metadao.installOrgan(mockOrgan.address, 3)
    mockedOrgan = MockedOrgan.at(dao.address)
  })

  context('dispatches vanilla transaction', () => {
    it('with 0 ETH', async () => {
      await mockedOrgan.mock_setNumber(3)
      assert.equal(await mockedOrgan.mock_getNumber(), 3, 'should have dispatched method')
    })

    it('with more than 0 ether', async () => {
      const value = 101
      await mockedOrgan.mock_setNumber(3, { value })
      assert.equal(await mockedOrgan.mock_getNumber(), 3, 'should have dispatched method')

      const etherToken = EtherToken.at(await kernel.getEtherToken())
      assert.equal(await etherToken.balanceOf(dao.address), value, 'transferred ether should be inside ETH token')
    })
  })

  context('dispatches presigned transactions', () => {
    const signedTransaction = async nonce => {
      const data = mockedOrgan.mock_setNumber.request(4).params[0].data
      const signingPayload = await kernel.payload(data, 1)
      const signedPayload = await sign(signingPayload, accounts[0])

      const adding0x = x => '0x'.concat(x)
      return {
        r: adding0x(signedPayload.substr(2, 64)),
        s: adding0x(signedPayload.substr(66, 64)),
        v: adding0x(signedPayload.substr(130, 2)),
        data,
      }
    }

    beforeEach(async () => {
      const nonce = 1
      const { r, s, v, data } = await signedTransaction(nonce)
      await kernel.preauthDispatch(data, nonce, r, s, v)
    })

    it('basic presigned dispatch', async() => {
      assert.equal(await mockedOrgan.mock_getNumber(), 4, 'should have dispatched method')
    })
  })
})