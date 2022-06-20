REGION := ap-northeast-1

# インスタンス
EC2_INSTANCE := i-0a4e350b76a70777d

.PHONY: help
help: ## show commands ## make
	@echo "AWS_ACCOUNT:= $(AWS_ACCOUNT)"
	@printf "\033[36m%-30s\033[0m %-50s %s\n" "[Sub command]" "[Description]" "[Example]"
	@grep -E '^[/a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | perl -pe 's%^([/a-zA-Z_-]+):.*?(##)%$$1 $$2%' | awk -F " *?## *?" '{printf "\033[36m%-30s\033[0m %-50s %s\n", $$1, $$2, $$3}'


.PHONY: ------ssm------
------ssm------------: ## ----------------------------------- ## ------------------------------------
	@echo "divider"


.PHONY: ssm-prod
ssm-prod: ## start ssm in prod ## make ssm
	aws ssm start-session --target $(EC2_INSTANCE)
