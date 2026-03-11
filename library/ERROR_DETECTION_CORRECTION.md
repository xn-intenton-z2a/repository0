# ERROR_DETECTION_CORRECTION

## Table of Contents

1. Error Detection and Correction Fundamentals
2. Types of Error Correction Methods
3. Automatic Repeat Request (ARQ) Protocols
4. Forward Error Correction (FEC) Techniques
5. Historical Development and Applications

## Normalised Extract

### Error Detection and Correction Fundamentals

Error detection and correction (EDAC) or error control are techniques that enable reliable delivery of digital data over unreliable communication channels. Many communication channels are subject to channel noise, and thus errors may be introduced during transmission from the source to a receiver.

Error detection is the detection of errors caused by noise or other impairments during transmission from the transmitter to the receiver. Error correction is the detection of errors and reconstruction of the original, error-free data.

All error-detection and correction schemes add some redundancy (extra data) to a message, which receivers can use to check consistency of the delivered message and to recover data that has been determined to be corrupted.

### Types of Error Correction Methods

There are three major types of error correction:

Automatic Repeat Request (ARQ): Makes use of error-detection codes, acknowledgment and/or negative acknowledgment messages, and timeouts to achieve reliable data transmission.

Forward Error Correction (FEC): A process of adding redundant data such as an error-correcting code (ECC) to a message so that it can be recovered by a receiver even when errors are introduced.

Hybrid Automatic Repeat Request (HARQ): A combination of ARQ and error-correction coding for adaptive error control.

### Automatic Repeat Request (ARQ) Protocols

ARQ is an error control method for data transmission that uses error-detection codes, acknowledgment messages, and timeouts. An acknowledgment is a message sent by the receiver to indicate that it has correctly received a data frame.

When the transmitter does not receive the acknowledgment before the timeout occurs, it retransmits the frame until it is either correctly received or the error persists beyond a predetermined number of retransmissions.

Three types of ARQ protocols:
- Stop-and-wait ARQ: Simple protocol where sender waits for acknowledgment before sending next frame
- Go-Back-N ARQ: Allows multiple frames in transit but retransmits from error point
- Selective Repeat ARQ: Only retransmits specifically failed frames

ARQ is appropriate if the communication channel has varying or unknown capacity, such as on the Internet. However, ARQ requires availability of a back channel, results in increased latency due to retransmissions, and requires maintenance of buffers and timers.

### Forward Error Correction (FEC) Techniques

FEC adds redundant data such as error-correcting codes to a message so that it can be recovered by a receiver even when errors are introduced during transmission or storage. Since the receiver does not have to ask the sender for retransmission, a backchannel is not required.

Error-correcting codes are used in lower-layer communication such as cellular networks, high-speed fiber-optic communication and Wi-Fi, as well as for reliable storage in media such as flash memory, hard disk and RAM.

Error-correcting codes are usually distinguished between convolutional codes and block codes. Block codes work on fixed-size blocks of bits or symbols, while convolutional codes work on bit or symbol streams of arbitrary length.

### Historical Development and Applications

The modern development of error correction codes is credited to Richard Hamming in 1947. A description of Hamming's code appeared in Claude Shannon's A Mathematical Theory of Communication and was quickly generalized by Marcel J. E. Golay.

Historical precedent exists in classical antiquity, where copyists of the Hebrew Bible were paid according to the number of lines of verse. Between the 7th and 10th centuries CE, Jewish scribes formalized the Numerical Masorah to ensure accurate reproduction of sacred text through letter counting and statistical analysis.

## Supplementary Details

Error detection and correction schemes can be systematic or non-systematic. In systematic schemes, the transmitter sends original data with attached check bits derived by encoding algorithms. Non-systematic codes transform the original message into an encoded message carrying the same information.

Good error control performance requires scheme selection based on communication channel characteristics. Common channel models include memoryless models where errors occur randomly with certain probability, and dynamic models where errors occur primarily in bursts.

## Reference Details

### Error Correction Capabilities

For codes with minimum Hamming distance d:
- Error detection capability: Can detect up to d-1 errors
- Error correction capability: Can correct up to floor((d-1)/2) errors
- Sphere packing: Error-correcting balls of radius k centered on codewords must be disjoint

### ARQ Protocol Specifications

Stop-and-wait ARQ:
- Simplest protocol with minimal buffer requirements
- Low throughput due to waiting for acknowledgments
- Suitable for half-duplex channels

Go-Back-N ARQ:
- Window size N allows multiple unacknowledged frames
- Efficient for low error rates
- Requires receiver buffering and sequence numbering

Selective Repeat ARQ:
- Most efficient for channels with moderate error rates  
- Requires sophisticated buffer management
- Higher complexity but optimal throughput

### FEC Code Categories

Convolutional Codes:
- Process information sequences of arbitrary length
- Use shift register and modulo-2 addition
- Suitable for real-time applications

Block Codes:
- Process fixed-length information blocks
- Include Hamming codes, Reed-Solomon codes, BCH codes
- Optimal for burst error correction

### Channel Model Classifications

Memoryless Channels:
- Errors occur independently with fixed probability
- Binary Symmetric Channel (BSC) model
- Suitable for random error correction

Burst Error Channels:
- Errors occur in concentrated bursts
- Gilbert-Elliott model for bursty channels
- Require specialized burst error correction codes

### Implementation Considerations

Systematic vs Non-systematic Encoding:
- Systematic: Original data preserved with appended parity
- Non-systematic: Original data transformed completely
- Trade-offs between encoding efficiency and data transparency

Performance Metrics:
- Code rate: Information bits per total transmitted bits
- Error probability: Residual error rate after correction
- Complexity: Computational requirements for encoding/decoding

## Detailed Digest

Technical content extracted from Wikipedia Error Detection and Correction article covering fundamental concepts, protocol types, historical development, and implementation approaches. Retrieved 2026-03-10.

Comprehensive coverage of error control techniques essential for reliable data transmission in digital communication systems, from basic detection methods to advanced correction algorithms.

## Attribution Information

Source: https://en.wikipedia.org/wiki/Error_detection_and_correction
Data size: 10000 characters extracted  
Retrieved: 2026-03-11