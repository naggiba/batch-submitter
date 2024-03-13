import { Contract, BigNumber } from 'ethers';
import { TransactionResponse, TransactionRequest } from '@ethersproject/abstract-provider';
import { keccak256 } from 'ethers/lib/utils';
import { AppendSequencerBatchParams, BatchContext, encodeAppendSequencerBatch, encodeHex } from '@eth-optimism/core-utils';

// Exporting utility functions and types for external use
export { encodeAppendSequencerBatch, BatchContext, AppendSequencerBatchParams };

/**
 * CanonicalTransactionChainContract is a wrapper around the Ethers Contract class,
 * specifically tailored for the Optimism network's Canonical Transaction Chain (CTC).
 * It includes a specialized method for appending sequencer batches with optimized encoding.
 */
export class CanonicalTransactionChainContract extends Contract {
 /**
   * Appends a sequencer batch to the CTC.
   * @param batch - The batch parameters to append.
   * @param options - Optional transaction request parameters.
   * @returns A promise that resolves to the transaction response.
   */
 public async appendSequencerBatch(
    batch: AppendSequencerBatchParams,
    options?: TransactionRequest
  ): Promise<TransactionResponse> {
    return appendSequencerBatch(this, batch, options);
 }
}

/**********************
 * Internal Functions *
 *********************/

// Method ID for the appendSequencerBatch method, used for encoding the transaction data
const APPEND_SEQUENCER_BATCH_METHOD_ID = 'appendSequencerBatch()';

/**
 * Encodes and sends a transaction to append a sequencer batch to the CTC.
 * @param OVM_CanonicalTransactionChain - The contract instance.
 * @param batch - The batch parameters to append.
 * @param options - Optional transaction request parameters.
 * @returns A promise that resolves to the transaction response.
 */
const appendSequencerBatch = async (
 OVM_CanonicalTransactionChain: Contract,
 batch: AppendSequencerBatchParams,
 options?: TransactionRequest
): Promise<TransactionResponse> => {
 // Calculate the method ID for the appendSequencerBatch method
 const methodId = keccak256(Buffer.from(APPEND_SEQUENCER_BATCH_METHOD_ID)).slice(2, 10);
 // Encode the batch parameters
 const calldata = encodeAppendSequencerBatch(batch);
 // Send the transaction
 return OVM_CanonicalTransactionChain.signer.sendTransaction({
    to: OVM_CanonicalTransactionChain.address,
    data: '0x' + methodId + calldata,
    ...options,
 });
};

/**
 * Encodes the batch context into a hexadecimal string.
 * @param context - The batch context to encode.
 * @returns The encoded batch context as a hexadecimal string.
 */
const encodeBatchContext = (context: BatchContext): string => {
 return (
    encodeHex(context.numSequencedTransactions, 6) +
    encodeHex(context.numSubsequentQueueTransactions, 6) +
    encodeHex(context.timestamp, 10) +
    encodeHex(context.blockNumber, 10)
 );
};
