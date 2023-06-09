import { MetaDto, ResponseDto } from '../dto/response.dto';
import { Transformer } from './transformer';

export class ResponseTransformer<Input, Output>
  implements Transformer<Input, ResponseDto<Output>, MetaDto>
{
  constructor(protected itemTransformer: Transformer<Input, Output>) {}

  transform(item: Input, meta?: MetaDto): ResponseDto<Output> {
    return {
      data: this.itemTransformer.transform(item),
      meta,
    };
  }
}
